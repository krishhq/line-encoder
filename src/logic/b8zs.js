/**
 * bipolar wih 8 zero substitution
 * 
 * replace 8 consecutive zeros
 * 
 * *******************************
 * case 1: if no 8 lagatar zeros, same as AMI(bipolar line encoding)
 * bit 0: zero
 * bit 1: alternating +ve 'nd -ve voltage (assume +ve logic)
 * *******************************
 * 
 * *******************************
 * case 2: if 8 lagatar zeros
 * check previous voltage level,
 * 
 * if +ve then 8 zeros ko laat par jayega aur
 * uske jagah pe 000+-0-+ aa jayega
 * 
 * if -ve then 8 zeros ko laat par jayega aur
 * uske jagah pe 000-+0+- aa jayega
 * 
 * 000VB0VB
 * V:violation (violation of AMI rule)
 * B:bipolar (opposite of the previos voltage)
 * ********************************
 */