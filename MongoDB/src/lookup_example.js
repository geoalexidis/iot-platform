db.serviceinstructions.aggregate([
   {
      $unwind: "$tools_id"
   },
   {
      $lookup:
         {
            from: "tool",
            localField: "tools_id",
            foreignField: "_id",
            as: "tool_docs"
        }
   },
   {
      $match: { "tool_docs": { $ne: [] } }
   }
])