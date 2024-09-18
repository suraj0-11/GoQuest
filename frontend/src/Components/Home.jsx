import React from "react";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Your Application</h1>
        <p>Your journey starts here!</p>
      </header>

      <section className="home-content">
        <div className="intro">
          <h2>Introduction</h2>
          <p>
            This is your Home page. You can customize this section to provide an
            overview of your app, display important features, or guide users to
            different parts of the application.
          </p>
        </div>

        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>Feature 1: Description</li>
            <li>Feature 2: Description</li>
            <li>Feature 3: Description</li>
          </ul>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2024 Your App Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
