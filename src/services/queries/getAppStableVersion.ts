import type { IStableVersion } from "@/types/api/IStableVersion";

import { getFromCacheOnError } from "../cache";

export const getAppStableVersion = (): Promise<IStableVersion | null> => {
  return getFromCacheOnError<IStableVersion>({ url: "/mobile/version" });
};
