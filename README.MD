# Diff between 2 text files

    # install (require node >7)
    $ git clone https://github.com/polesskiy-dev/node-lcs-text-diff.git
    $ cd node-lcs-text-diff   
    # display diff between test files: ./example-files/1.txt ./example-files/2.txt
    $ npm start
    # display diff between custom files:
    $ node index.js path_to_original_file path_to_mutated_file

## Algorithm description

  Absolutely standard solution for finding diff between 2 sources:
  * Follow finding longest common subsequence approach with help of dynamic programming
  * Get matrix during filling lcs
  * Walk through lcs matrix back from highest numbers to lowest
    * move left means insert from 2nd file
    * move up means delete from 1st file
    * move diagonal and different lines in 1st and 2nd means replacing line by 2nd file line
    * Push to result stack
  * Display lines according to result stack position

  ## Result example
  ### sources
  Some    Another
  Simple  Text
  Text    File
  File    With
          Additional
          Lines

  ### result

    $ node index.js ./example-files/1.txt ./example-files/2.txt

    1 * Some | Another
    2 - Simple
    3   Text
    4   File
    5 + With
    6 + Additional
    7 + Lines
