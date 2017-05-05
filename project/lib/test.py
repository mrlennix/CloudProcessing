import cv2
import numpy as np
import sys

#test.py filename edit param1 param2 etc

args = sys.argv

fname = args[1]
edit = args[2]
save = args[3]
print (fname)
print (edit)
print (save)
#Read Image
img = cv2.imread(fname)

if(edit == "grayscale"):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cv2.imwrite(save,gray)
    # print("Gath here =================================")


elif(edit == "gaussian"):
    blur = cv2.GaussianBlur( img, (0,0), float(args[3]))
    cv2.imwrite('edit.jpg',blur)

elif(edit == "invert"):
    invert = (255-  (cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)))
    cv2.imwrite(save,invert)


elif(edit == "blur"):
    blur = cv2.blur(img,(100,100))
    cv2.imwrite(save,blur)
    print("Gath here =================================")

elif(edit == "gradient"):
    kernel = np.ones((5,5),np.uint8)
    gradient = cv2.morphologyEx(img, cv2.MORPH_GRADIENT, kernel)
    cv2.imwrite('gradient.jpg',gradient)






