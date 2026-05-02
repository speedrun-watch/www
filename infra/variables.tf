variable "acm_certificate_arn" {
  description = "ACM certificate ARN for speedrun.watch (us-east-1)"
  type        = string
}

# cloudfront_block_direct_access_function_name removed — the CloudFront
# function is now defined in cloudfront_function.tf and referenced directly.
