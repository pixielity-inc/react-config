import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const handleGithubClick = () => {
    window.open("https://github.com/abdokouta/config", "_blank");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Configuration&nbsp;</span>
          <span className={title({ color: "blue" })}>Management&nbsp;</span>
          <br />
          <span className={title()}>for React Apps</span>
          <div className={subtitle({ class: "mt-4" })}>
            Built with @abdokouta/config - NestJS-inspired config module
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/config">
            <Button size="lg">View Config Demo</Button>
          </Link>
          <Button size="lg" variant="outline" onPress={handleGithubClick}>
            <GithubIcon size={20} />
            GitHub
          </Button>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2 rounded-xl bg-surface shadow-surface px-4 py-2">
            <pre className="text-sm font-medium font-mono">
              npm install{" "}
              <code className="px-2 py-1 h-fit font-mono font-normal inline whitespace-nowrap rounded-sm bg-accent-soft-hover text-accent text-sm">
                @abdokouta/config @abdokouta/react-di
              </code>
            </pre>
          </div>
        </div>

        <div className="mt-8 max-w-2xl">
          <h3 className="text-xl font-bold mb-4 text-center">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-default-100">
              <h4 className="font-semibold mb-2">🔧 Multiple Drivers</h4>
              <p className="text-sm text-default-600">
                Environment variables, JSON files, and more
              </p>
            </div>
            <div className="p-4 rounded-lg bg-default-100">
              <h4 className="font-semibold mb-2">📝 Type-Safe Access</h4>
              <p className="text-sm text-default-600">
                getString, getNumber, getBool, getArray, getJson
              </p>
            </div>
            <div className="p-4 rounded-lg bg-default-100">
              <h4 className="font-semibold mb-2">🎯 Auto Prefix Detection</h4>
              <p className="text-sm text-default-600">
                Automatically strips VITE_ or NEXT_PUBLIC_ prefixes
              </p>
            </div>
            <div className="p-4 rounded-lg bg-default-100">
              <h4 className="font-semibold mb-2">💉 DI Integration</h4>
              <p className="text-sm text-default-600">
                Seamless integration with dependency injection
              </p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
