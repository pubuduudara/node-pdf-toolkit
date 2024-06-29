import { S3 } from "aws-sdk";
export class S3Service {
  private LINK_EXPIRATION_DURATION = 3000;
  private s3Client = new S3({
    signatureVersion: "v4",
    region: "us-east-1",
  });
  /**
   * get S3 pre-signed URL to get image
   * @param {*} bucketName
   * @param {*} folder
   * @param {*} fileName
   * @param {*} operation
   */
  async getPreSignedUrl(
    bucketName: string,
    folder: string,
    fileName: string,
    operation: string
  ) {
    const params = {
      Bucket: bucketName,
      Key: `${folder}/${fileName}`,
      Expires: this.LINK_EXPIRATION_DURATION,
    };
    return this.s3Client.getSignedUrl(operation, params);
  }
}
