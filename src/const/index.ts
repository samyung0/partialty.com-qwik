import { profiles } from "../../drizzle_turso/schema/profiles";

export const ROLES_PERITTED_TO_UPLOAD_R2 = profiles.role.enumValues;
export const ROLES_PERITTED_TO_EDITCONTENT = profiles.role.enumValues;
export const MAX_SIZE_TO_UPLOAD_R2_FETCHGITHUB = 20 * 1000 * 1000; // bytes
export const MAX_NUMBER_OF_FILES_R2_FETCHGITHUB = 1000; // corresponds to maxkeys in ListObjectsCommand in s3 client, if this number is increased, we need to implement pagination in downloadGithubFetchCloudflareClient

export const BUN_API_ENDPOINT = "https://api.partialty.com";
export const BUN_API_ENDPOINT_WS = "ws://api.partialty.com";
export const PROD_FILES_URL = "https://files.partialty.com";
