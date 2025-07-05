// Helper function to generate consistent cache keys
const generateSubjectListCacheKey = (params) => {
  const { sort, classRoom, boardType, name, batch, userId } = params;
  const parts = [
    "subjects",
    "list",
    userId ? `user:${userId}` : "",
    classRoom ? `class:${classRoom}` : "",
    boardType ? `board:${boardType}` : "",
    name ? `name:${name.toLowerCase().replace(/\s+/g, "-")}` : "",
    batch ? `batch:${batch}` : "",
    sort ? `sort:${sort}` : "",
  ];

  // Filter out empty parts and join with ':'
  return parts.filter((part) => part !== "").join(":");
};

module.exports = {
  generateSubjectListCacheKey,
};
