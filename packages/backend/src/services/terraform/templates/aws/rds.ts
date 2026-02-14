export function rdsTemplate(options: {
  projectName: string;
  environment: string;
  engine?: string;
  instanceClass?: string;
  allocatedStorage?: number;
  multiAz?: boolean;
}): string {
  const {
    projectName,
    environment,
    engine = "postgres",
    instanceClass = "db.t3.medium",
    allocatedStorage = 100,
    multiAz = true,
  } = options;

  const engineVersion = engine === "postgres" ? "15.4" : "8.0";

  return `# RDS Module - Production-ready database
variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }

resource "aws_db_subnet_group" "main" {
  name       = "\${var.project_name}-\${var.environment}-db"
  subnet_ids = var.private_subnet_ids
  tags = { Name = "\${var.project_name}-\${var.environment}-db-subnet" }
}

resource "aws_security_group" "rds" {
  name_prefix = "\${var.project_name}-\${var.environment}-rds-"
  vpc_id      = var.vpc_id
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = []
    description     = "PostgreSQL from app"
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
  tags = { Name = "\${var.project_name}-\${var.environment}-rds-sg" }
}

resource "aws_db_instance" "main" {
  identifier = "\${var.project_name}-\${var.environment}-db"
  engine               = "${engine}"
  engine_version       = "${engineVersion}"
  instance_class       = "${instanceClass}"
  allocated_storage    = ${allocatedStorage}
  storage_type         = "gp3"
  storage_encrypted    = true
  db_name  = "app"
  username = "admin"
  password = "CHANGE_ME_IN_TFVARS"
  multi_az               = ${multiAz}
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  skip_final_snapshot = true
  tags = { Name = "\${var.project_name}-\${var.environment}-db" }
}

output "db_endpoint" { value = aws_db_instance.main.endpoint }
output "db_arn" { value = aws_db_instance.main.arn }
`;
}
