none:

install:
	sudo apt-get install python luarocks libprotobuf-dev protobuf-compiler cmake nodejs nodejs-legacy
	cd ~/
	git clone https://github.com/torch/distro.git ~/torch --recursive
	cd ~/torch; bash install-deps;
	cd ~/torch: ./install.sh
	sudo ~/torch/install/bin/luarocks install loadcaffe
	cd ~/
	git clone https://github.com/jcjohnson/neural-style.git
	cd ~/neural-style; sh models/download_models.sh
