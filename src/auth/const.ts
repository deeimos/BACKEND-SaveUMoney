interface IJwtConstants {
  secret: string;
  expiresIn: string;
}

export const getJwtConstants = (): IJwtConstants => ({
  secret: process.env.JWT_KEY || '',
  expiresIn: process.env.EXPIRESIN || ''
});
