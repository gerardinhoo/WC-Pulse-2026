# ── SSM Parameter Store ──
resource "aws_ssm_parameter" "jwt_secret" {
  name  = "/${var.project_name}/JWT_SECRET"
  type  = "SecureString"
  value = var.jwt_secret

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "database_url" {
  name  = "/${var.project_name}/DATABASE_URL"
  type  = "SecureString"
  value = var.database_url

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "cors_origin" {
  name  = "/${var.project_name}/CORS_ORIGIN"
  type  = "String"
  value = join(",", var.cors_origins)
}

resource "aws_ssm_parameter" "app_url" {
  name  = "/${var.project_name}/APP_URL"
  type  = "String"
  value = var.app_url
}
