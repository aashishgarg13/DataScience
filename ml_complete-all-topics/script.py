
# Extract new topics from the latest PDFs

new_topics = {
    "optimal_k_knn": {
        "title": "Finding Optimal K in KNN",
        "concepts": [
            "Elbow method for finding optimal K",
            "Cross-validation to find best K",
            "Testing K values 1-20",
            "Mean accuracy across k-folds",
            "Avoiding underfitting and overfitting"
        ],
        "data": {
            "k_values": list(range(1, 20)),
            "accuracies_fold1": [0.98, 0.95, 0.92, 0.90, 0.88, 0.86, 0.85, 0.84, 0.83, 0.82, 0.81, 0.80, 0.79, 0.78, 0.77, 0.76, 0.75, 0.74, 0.73],
            "accuracies_fold2": [0.96, 0.93, 0.91, 0.89, 0.87, 0.85, 0.83, 0.82, 0.81, 0.80, 0.79, 0.78, 0.77, 0.76, 0.75, 0.74, 0.73, 0.72, 0.71],
            "accuracies_fold3": [0.94, 0.92, 0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.79, 0.78, 0.77, 0.76, 0.75, 0.74, 0.73, 0.72, 0.71, 0.70, 0.69]
        }
    },
    
    "hyperparameter_tuning": {
        "title": "Hyperparameter Tuning with GridSearch",
        "concepts": [
            "What are hyperparameters?",
            "GridSearch exhaustive search",
            "Testing multiple parameter combinations",
            "Finding optimal hyperparameters",
            "Train/test performance comparison"
        ],
        "svm_params": {
            "C": [0.1, 1, 10, 100],
            "gamma": ["scale", "auto", 0.001, 0.01],
            "kernel": ["linear", "poly", "rbf"]
        },
        "results": {
            "best_C": 1,
            "best_gamma": "scale",
            "best_kernel": "rbf",
            "best_score": 0.95
        }
    },
    
    "naive_bayes": {
        "title": "Naive Bayes Classification",
        "concepts": [
            "Probabilistic classifier",
            "Bayes' theorem",
            "Independence assumption",
            "Prior and posterior probabilities",
            "Feature independence"
        ],
        "formulas": [
            "P(C|X) = P(X|C) × P(C) / P(X)",
            "P(X|C) = P(x1|C) × P(x2|C) × ... × P(xn|C)",
            "Posterior = Likelihood × Prior / Evidence"
        ]
    },
    
    "decision_trees": {
        "title": "Decision Trees",
        "concepts": [
            "Tree structure with nodes and branches",
            "Splitting criteria (Information Gain, Gini)",
            "Entropy calculation",
            "Recursive splitting",
            "Leaf nodes for predictions"
        ]
    },
    
    "ensemble_methods": {
        "title": "Ensemble Methods",
        "concepts": [
            "Bagging (Bootstrap Aggregating)",
            "Boosting (AdaBoost, Gradient Boosting)",
            "Random Forest",
            "Combining weak learners",
            "Voting mechanisms"
        ]
    }
}

print("="*80)
print("NEW TOPICS FROM 26-10-2025 LECTURES")
print("="*80)

for topic_id, topic_data in new_topics.items():
    print(f"\n📚 {topic_data['title'].upper()}")
    print(f"   Concepts: {len(topic_data['concepts'])}")
    for i, concept in enumerate(topic_data['concepts'], 1):
        print(f"      {i}. {concept}")

print("\n" + "="*80)
print("TOPICS TO ADD TO APPLICATION")
print("="*80)
print("""
NEW TOPICS (from 26-10-2025):
1. ✅ Finding Optimal K in KNN (Elbow Method + Cross-Validation)
2. ✅ Hyperparameter Tuning with GridSearch
3. ✅ Naive Bayes Classification
4. ✅ Decision Trees
5. ✅ Ensemble Methods (Bagging, Boosting, Random Forest)

FIXES NEEDED:
1. ✅ Fix Linear Regression Visualization (currently not showing)
2. ✅ Add MORE visualizations for every algorithm
3. ✅ Add Mathematical explanations for WHY each algorithm
4. ✅ Add More Real-World Examples
5. ✅ Explain WHY one algorithm works vs another
6. ✅ Add comparison visualizations between algorithms
""")

print("\n" + "="*80)
print("ENHANCED LINEAR REGRESSION VISUALIZATION FIX")
print("="*80)
print("""
The Linear Regression visualization issue will be fixed with:
1. Proper Canvas initialization
2. Error handling for drawing
3. Auto-scaling for data points
4. Clear axes and labels
5. Live updating as sliders move
6. Residual lines visualization
7. MSE display with calculation breakdown
""")
