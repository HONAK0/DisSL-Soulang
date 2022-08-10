def oneNum 321
def twoNum 123

int multiply(one : int, two : int) = one * two

int main(argc : int, argv : string[])
    int result = multiply(oneNum, twoNum)
    print("%d\n", result)
end