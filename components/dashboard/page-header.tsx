type Props = {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <header className="dash-page-head">
      <div className="dash-page-head-copy">
        {eyebrow ? <p className="dash-eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <div className="dash-page-head-desc">{description}</div> : null}
      </div>
      {actions ? <div className="dash-page-head-actions">{actions}</div> : null}
    </header>
  )
}
