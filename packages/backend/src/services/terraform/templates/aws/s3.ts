export function s3Template(options: {
  projectName: string;
  environment: string;
  versioning?: boolean;
  encryption?: boolean;
}): string {
  const {
    projectName,
    environment,
    versioning = true,
    encryption = true,
  } = options;

  const versioningResource = versioning
    ? `
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration { status = "Enabled" }
}
`
    : "";

  const encryptionResource = encryption
    ? `
resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
    bucket_key_enabled = true
  }
}
`
    : "";

  return `# S3 Module - Object storage with best practices
variable "project_name" { type = string }
variable "environment" { type = string }

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "main" {
  bucket = "\${var.project_name}-\${var.environment}-assets-\${data.aws_caller_identity.current.account_id}"
  tags   = { Name = "\${var.project_name}-\${var.environment}-assets" }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
${versioningResource}
${encryptionResource}

output "bucket_name" { value = aws_s3_bucket.main.id }
output "bucket_arn" { value = aws_s3_bucket.main.arn }
`;
}
