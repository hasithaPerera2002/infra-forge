export function ec2Template(options: {
  projectName: string;
  environment: string;
  minSize?: number;
  maxSize?: number;
  instanceType?: string;
}): string {
  const {
    projectName,
    environment,
    minSize = 2,
    maxSize = 10,
    instanceType = "t3.medium",
  } = options;

  return `# Compute Module - Auto Scaling Group with Launch Template
variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "target_group_arn" { type = string }
variable "alb_security_group_id" { type = string }

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]
  filter { name = "name"; values = ["amzn2-ami-hvm-*-x86_64-gp2"] }
}

resource "aws_launch_template" "web" {
  name_prefix   = "\${var.project_name}-\${var.environment}-web-"
  image_id      = data.aws_ami.amazon_linux_2.id
  instance_type = "${instanceType}"
  vpc_security_group_ids = [aws_security_group.web.id]
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }
  monitoring { enabled = true }
  tag_specifications {
    resource_type = "instance"
    tags = { Name = "\${var.project_name}-\${var.environment}-web" }
  }
  lifecycle { create_before_destroy = true }
}

resource "aws_security_group" "web" {
  name_prefix = "\${var.project_name}-\${var.environment}-web-"
  vpc_id      = var.vpc_id
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
    description     = "HTTP from ALB"
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
  tags = { Name = "\${var.project_name}-\${var.environment}-web-sg" }
}

resource "aws_autoscaling_group" "web" {
  name                = "\${var.project_name}-\${var.environment}-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [var.target_group_arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300
  min_size         = ${minSize}
  max_size         = ${maxSize}
  desired_capacity = ${minSize}
  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }
  tag { key = "Name"; value = "\${var.project_name}-\${var.environment}-web"; propagate_at_launch = true }
}

output "asg_name" { value = aws_autoscaling_group.web.name }
output "security_group_id" { value = aws_security_group.web.id }
`;
}
