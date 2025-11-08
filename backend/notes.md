## Problem
Given an itemized list of inputs and outputs, matches these to each other probabilistically using VSS of their names. Keeps track of "pantry" and "trash" items to allow modification as well.

## Solution
Considers the problem as one of determining edges between a bipartite graph where output -> input edges can only ever occur backward in time.

## Scope
1. whole -> whole
2. whole -> partial
3. whole -> dish (transformer description -> ingredient distribution)
  - But this can be decomposed back to the original whole -> partial problem
