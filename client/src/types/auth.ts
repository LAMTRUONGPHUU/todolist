
export type MeUser = {
  id: string;
  email: string;
  avatar: string;
};

export type MeResponse = {
  user: MeUser;
  accessToken: string;
};
