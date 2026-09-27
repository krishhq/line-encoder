/**
 * high density bipolar of order 3
 * 
 * replace 4 lagatar zeros
 * 
 * **********************************************
 * case 1: if no 4 lagatar zeros, same as AMI
 * bit 0: zero
 * bit 1: alternating +ve 'nd -ve voltage 
 * **********************************************
 * 
 * 
 * **********************************************
 * case 2: if 4 lagatar zeros
 * check if total non zero voltages is odd
 * then previous voltage agar +ve rahega toh
 * 4 zeros ko laat padega aur 000+ aa jayega
 * previous voltage agar -ve rahega toh 000- aa 
 * jayega
 * odd:000V
 * 
 * 
 * aur agar total non zero voltages even rha
 * toh previous voltage agar +ve rha toh -00- aa
 * jayega
 * aur -ve rha toh +00+ aa jayega
 * even:B00V
 * 
 * 
 * #&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&#&
 * number of non zero voltages, last submission
 * se count karna hai
 * $@$@$$@$@$@$@$@$@$@$@$@$@$@$@$$$@$@$@$@$@$@$@
 * 
 * 
 */