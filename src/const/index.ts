export const ROLE_PERITTED_TO_UPLOAD_R2 = "free";
export const MAX_SIZE_TO_UPLOAD_R2_FETCHGITHUB = 20 * 1024 * 1024; // bytes
export const MAX_NUMBER_OF_FILES_R2_FETCHGITHUB = 1000; // corresponds to maxkeys in ListObjectsCommand in s3 client, if this number is increased, we need to implement pagination in downloadGithubFetchCloudflareClient
