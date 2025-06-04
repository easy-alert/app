export type MutationResponse<T = undefined> = T extends undefined
  ? {
      success: boolean;
    }
  :
      | {
          success: true;
          data: T;
        }
      | {
          success: false;
          data: null;
        };
