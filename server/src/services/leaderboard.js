export const calculatePoints = (prediction, match) => {
  if(match.homeScore === null || match.awayScore === null) {
    return 0; // match not played yet
  }

  const predictedDiff = prediction.homeScore - prediction.awayScore;
  const actualDiff = match.homeScore - match.awayScore;

  // Exact score
  if (prediction.homeScore === match.homeScore &&
       prediction.awayScore === match.awayScore ) {
    return 3;
   }

   // Correct Winner
   if (
    (predictedDiff > 0 && actualDiff > 0) || 
    (predictedDiff < 0 && actualDiff < 0) ||
    (predictedDiff === 0 && actualDiff === 0)
   ) {
    return 1;
   }

   return 0;
}