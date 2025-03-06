export interface IError {
  config: any;
  header: any;
  request: any;

  data: {
    ServerMessage: {
      message: string;
    }
  }

  status: number;
  statusText: string;
}