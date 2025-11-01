
export const getTimestamp = () :string => {
  const now = new Date();
  return now.toISOString().slice(0, 19); 
}