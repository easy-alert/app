export type MutationResponse<T = undefined> = T extends undefined
  ? {
      success: boolean;
      message: string;
    }
  :
      | {
          success: true;
          message: string;
          data: T;
        }
      | {
          success: false;
          message: string;
          data: null;
        };
