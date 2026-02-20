# -----------------------------------------------------------------------------
# Import Blocks — S3
# -----------------------------------------------------------------------------

import {
  to = aws_s3_bucket.frontend
  id = "srcfrontend"
}

import {
  to = aws_s3_bucket_policy.frontend
  id = "srcfrontend"
}

# -----------------------------------------------------------------------------
# Import Blocks — CloudFront
# -----------------------------------------------------------------------------

import {
  to = aws_cloudfront_distribution.frontend
  id = "E2VFWO07DT5JCU"
}

import {
  to = aws_cloudfront_origin_access_control.frontend
  id = "E137NNW0SWRCOH"
}
