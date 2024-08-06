export class JwtTokenHeaderFormDto {
  headerName: string;
  jwtToken: string;

  constructor(headerName: string, jwtToken: string) {
    this.headerName = headerName;
    this.jwtToken = jwtToken;
  }
}
