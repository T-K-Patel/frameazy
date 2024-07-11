export type ServerActionReturnType<K> =
    | {
          success: true;
          data: K;
      }
    | {
          success: false;
          error: string;
      };
