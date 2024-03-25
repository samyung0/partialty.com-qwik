import { faker } from "@faker-js/faker";
import { LuciaSession } from "~/types/LuciaSession";
import { createUser as createDBUser } from "../vitest/models/user.model";

const createUser = (role: LuciaSession["user"]["role"]) =>
  createDBUser({
    id: faker.string.uuid(),
    avatar_url: "",
    nickname: faker.internet.userName(),
    role,
    email: faker.internet.email(),
    email_verified: true,
  });

export const createNormalUser = () => createUser("free");
export const createPaidUser = () => createUser("paid");
export const createTeacherUser = () => createUser("teacher");
export const createAdminUser = () => createUser("admin");
export { getUser, removeUser } from "../vitest/models/user.model";
