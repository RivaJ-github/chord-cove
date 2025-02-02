export const logHub = (data: object | string) => {
  let log: string;
  if (typeof data === "string") {
    log = JSON.stringify({ event: data });
  } else {
    log = JSON.stringify(data);
  }
  const img = new Image();
  img.src = `/api/public/log?json=${encodeURIComponent(log)}&_t=${new Date().valueOf()}`;
};
