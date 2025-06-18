import ExampleApiUsage from '@/components/ExampleApiUsage';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Search
          </h1>
          <p className="text-xl text-gray-600">
            Build an interactive search and filtering experience
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready to build something amazing?
            </h2>
            <p className="text-gray-600 mb-6">
              The backend API is ready at <code className="bg-gray-100 px-2 py-1 rounded">/api/search</code>
            </p>
            <p className="text-sm text-gray-500">
              Check the README.md for full instructions and API documentation
            </p>
          </div>

          <ExampleApiUsage />
        </div>
      </div>
    </div>
  );
}
