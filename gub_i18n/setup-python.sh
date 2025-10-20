# This file must be used with "source setup-python.sh" *from bash*
# You cannot run it directly

# Install Python version via asdf
asdf install

# Create virtual environment in .venv
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install required packages
pip install -r requirements.txt
