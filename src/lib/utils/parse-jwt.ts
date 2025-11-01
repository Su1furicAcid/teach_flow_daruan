export interface JwtPayload {
  exp: number;
  iat: number;
  jti: string;
  role: number;
  token_type: 'access' | 'refresh';
  user_id: number;
}

export function parseJwt(token: string) {
  const [, payload] = token.split('.');
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function parseJwtExp(token: string) {
  const decoded = parseJwt(token);
  return decoded?.exp;
}