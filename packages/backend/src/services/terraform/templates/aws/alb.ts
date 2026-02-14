export function albTemplate(options: {
  projectName: string;
  environment: string;
}): string {
  const { projectName, environment } = options;
  return `# Application Load Balancer Module
variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "public_subnet_ids" { type = list(string) }

resource "aws_security_group" "alb" {
  name_prefix = "\${var.project_name}-\${var.environment}-alb-"
  vpc_id      = var.vpc_id
  ingress { from_port = 80; to_port = 80; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 443; to_port = 443; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"] }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
  tags = { Name = "\${var.project_name}-\${var.environment}-alb-sg" }
}

resource "aws_lb_target_group" "web" {
  name     = "\${var.project_name}-\${var.environment}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  health_check { enabled = true; path = "/"; interval = 30; timeout = 5; healthy_threshold = 2; unhealthy_threshold = 2 }
  tags = { Name = "\${var.project_name}-\${var.environment}-tg" }
}

resource "aws_lb" "main" {
  name               = "\${var.project_name}-\${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
  enable_deletion_protection = false
  enable_http2               = true
  tags = { Name = "\${var.project_name}-\${var.environment}-alb" }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"
  default_action { type = "forward"; target_group_arn = aws_lb_target_group.web.arn }
}

output "alb_dns_name" { value = aws_lb.main.dns_name }
output "alb_sg_id" { value = aws_security_group.alb.id }
output "target_group_arn" { value = aws_lb_target_group.web.arn }
`;
}
