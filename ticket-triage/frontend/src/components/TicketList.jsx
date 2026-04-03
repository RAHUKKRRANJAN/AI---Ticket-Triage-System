import { Fragment, useState } from 'react';
import './TicketList.css';

function TicketList({ tickets, loading, onRefresh }) {
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const toggleExpanded = (ticketId) => {
    setExpandedTicketId((current) => (current === ticketId ? null : ticketId));
  };

  return (
    <section className="ticket-list-panel">
      <div className="list-header">
        <h2>Recent Tickets</h2>
        <button type="button" className="refresh-button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="skeleton-table" aria-hidden="true">
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
        </div>
      ) : tickets.length === 0 ? (
        <p className="empty-state">No tickets yet. Submit your first ticket above.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Urgency</th>
                <th>Confidence</th>
                <th>Security</th>
                <th>Message Preview</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const isExpanded = expandedTicketId === ticket.id;
                const preview =
                  ticket.message.length > 60
                    ? `${ticket.message.slice(0, 60)}...`
                    : ticket.message;
                return (
                  <Fragment key={ticket.id}>
                    <tr
                      className={[
                        ticket.is_security_escalated ? 'security-row' : '',
                        ticket.priority === 'P0' ? 'p0-row' : '',
                        'clickable-row',
                      ]
                        .join(' ')
                        .trim()}
                      onClick={() => toggleExpanded(ticket.id)}
                    >
                      <td>{ticket.id}</td>
                      <td>{new Date(ticket.created_at).toLocaleString()}</td>
                      <td>{ticket.category}</td>
                      <td>{ticket.priority}</td>
                      <td>{ticket.urgency ? '🔴 Urgent' : '🟢 Normal'}</td>
                      <td>{Math.round(ticket.confidence_score * 100)}%</td>
                      <td>{ticket.is_security_escalated ? 'Yes' : 'No'}</td>
                      <td>{preview}</td>
                    </tr>
                    {isExpanded ? (
                      <tr className="expanded-row">
                        <td colSpan={8}>
                          <strong>Full Message:</strong> {ticket.message}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TicketList;
