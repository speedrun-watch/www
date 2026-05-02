# -----------------------------------------------------------------------------
# CloudFront Function — Host validation, www→apex redirect, and SPA path
# rewriting for prerendered routes.
#
# Imported from the existing externally-created `BlockDirectAccess` function so
# Terraform takes ownership; on the next apply, the code is updated to add the
# path-rewrite logic that prerendering needs.
# -----------------------------------------------------------------------------

resource "aws_cloudfront_function" "block_direct_access" {
  name    = "BlockDirectAccess"
  runtime = "cloudfront-js-2.0"
  comment = "Block direct S3 access, redirect www to apex, rewrite paths for prerendered routes"
  publish = true
  code    = file("${path.module}/cloudfront_function.js")
}

import {
  to = aws_cloudfront_function.block_direct_access
  id = "BlockDirectAccess"
}
