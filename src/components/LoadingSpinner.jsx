/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from '../store';

export default function LoadingSpinner() {
  const message = useStore.use.processingMessage();

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}