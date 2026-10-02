import { Component } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

/**
 * React Error Boundary — catches JS errors anywhere in the tree.
 * Shows a friendly error screen instead of a blank white page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Something went wrong</h2>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            An unexpected error occurred. This is likely a temporary issue.
          </p>
          {/* Show error detail only in development */}
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-left bg-black/30 rounded-lg p-3 text-xs text-red-300 mb-6 overflow-auto max-h-32">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.href = '/'
            }}
            className="btn-primary mx-auto"
          >
            <RefreshCw size={14} />
            Reload App
          </button>
        </div>
      </div>
    )
  }
}
