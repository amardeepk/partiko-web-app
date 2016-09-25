#sudo gulp build
#sudo cp app/scripts/jquery.js dist/scripts
#sudo cp app/scripts/customScript.js dist/scripts
#sudo cp -r app/i18n dist/

# sudo gulp build  #### changed by Karan Raina
sudo cp app/scripts/jquery.js dist/scripts
sudo cp app/scripts/customScript.js dist/scripts
sudo cp -r app/i18n dist/

#### added by Karan Raina ####
sudo cp -ar bower_components app/
sudo cp -ar app/styles/fonts app/
	
