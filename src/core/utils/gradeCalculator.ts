import { GRADE_THRESHOLDS } from '../constants/grades';

export const GradeCalculator = {
  /**
   * Computes the average of the test and exam scores.
   * Both scores are expected to be out of 20.
   */
  computeSubjectAverage: (testScore: number, examScore: number): number => {
    // Both are out of 20, average is out of 20
    return (testScore + examScore) / 2;
  },

  /**
   * Computes the total sheet score.
   * Total is just sum of all averages.
   */
  computeTotalSheet: (averages: number[]): number => {
    return averages.reduce((sum, avg) => sum + avg, 0);
  },

  /**
   * Evaluates the grade and returns the threshold object containing the translated labels.
   */
  getGradeLabel: (average: number) => {
    const roundedAverage = Math.round(average * 100) / 100;
    
    // Find the right threshold based on max and min
    const threshold = GRADE_THRESHOLDS.find(
      (t) => roundedAverage >= t.min && roundedAverage <= t.max
    );

    // Provide default fallback in case of floating point weirdness
    return threshold?.label ?? { ar: 'غير معروف', en: 'Unknown', fr: 'Inconnu' };
  },
};
