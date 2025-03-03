import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "../data"))

# File paths for URL and Email datasets
url_input_file = os.path.join(DATA_DIR, "processed_features.csv")
email_input_file = os.path.join(DATA_DIR, "processed_emails.csv")

url_train_file = os.path.join(DATA_DIR, "train_urls.csv")
url_test_file = os.path.join(DATA_DIR, "test_urls.csv")

email_train_file = os.path.join(DATA_DIR, "train_emails.csv")
email_test_file = os.path.join(DATA_DIR, "test_emails.csv")

# Function to split dataset
def split_dataset(input_file, train_file, test_file, label_column):
    if not os.path.exists(input_file):
        print(f"❌ Dataset not found: {input_file}\nSkipping split.")
        return

    df = pd.read_csv(input_file)
    train_df, test_df = train_test_split(df, test_size=0.2, stratify=df[label_column], random_state=42)

    train_df.to_csv(train_file, index=False)
    test_df.to_csv(test_file, index=False)

    print(f"✅ Train-Test split completed for {input_file}.")
    print(f"   Train data saved to: {train_file}")
    print(f"   Test data saved to: {test_file}")

# Split URL dataset
split_dataset(url_input_file, url_train_file, url_test_file, "label")

# Split Email dataset
split_dataset(email_input_file, email_train_file, email_test_file, "Label")
