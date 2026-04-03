from sqlalchemy.orm import Session

from app.analyzer.ticket_analyzer import TicketAnalyzer
from app.models.ticket import Ticket


class TicketService:
    def __init__(self) -> None:
        self.analyzer = TicketAnalyzer()

    def analyze_and_save(self, message: str, db: Session) -> Ticket:
        analysis = self.analyzer.analyze(message)
        ticket = Ticket(
            message=message,
            category=analysis["category"],
            priority=analysis["priority"],
            urgency=analysis["urgency"],
            confidence_score=analysis["confidence_score"],
            signals=analysis["signals"],
            keywords=analysis["keywords"],
            is_security_escalated=analysis["is_security_escalated"],
        )

        try:
            db.add(ticket)
            db.commit()
            db.refresh(ticket)
            return ticket
        except Exception:
            db.rollback()
            raise

    def get_recent_tickets(self, db: Session, limit: int = 50) -> list[Ticket]:
        return (
            db.query(Ticket)
            .order_by(Ticket.created_at.desc(), Ticket.id.desc())
            .limit(limit)
            .all()
        )
