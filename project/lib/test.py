import cv2
import numpy as np
import sys

args = sys.argv

fname = args[1]
edit = args[2]

#Read Image
img = cv2.imread(fname)

if(edit == "gradient"):
    kernel = np.ones((5,5),np.uint8)
    gradient = cv2.morphologyEx(img, cv2.MORPH_GRADIENT, kernel)
    cv2.imwrite('gradient.jpg',gradient)
elif(edit == "blur"):
    blur = cv2.blur(img,(100,100))
    cv2.imwrite('blur.jpg',blur)
elif(edit == "greyscale"):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite('greyscale.jpg',gray)
elif(edit == "blackhat"):
    kernel = np.ones((5,5),np.uint8)
    blackhat = cv2.morphologyEx(img, cv2.MORPH_BLACKHAT, kernel)
    cv2.imwrite('blackhat.jpg',blackhat)
elif(edit == "gaussian"):
    gaussian = cv2.GaussianBlur(img, (0,0), float(args[3]))
    cv2.imwrite('gaussian.jpg', gaussian)

print("Finished")

