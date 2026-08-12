import Layout from "./Layout";
import Header from "./Header";

const AuthPageLayout = ({ heading1, heading2, subtext, children }) => (
  <Layout>
    <div className="flex min-h-[calc(100vh-5rem)] flex-col bg-background dark:bg-dark-background">
      <Header
        heading1={heading1}
        heading2={heading2}
        subtext={subtext}
        compact
      />

      <div className="flex flex-1 justify-center px-4 pb-16 pt-8 md:pt-12">
        <div className="h-fit w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg dark:border-dark-border dark:bg-dark-card sm:p-8">
          {children}
        </div>
      </div>
    </div>
  </Layout>
);

export default AuthPageLayout;
