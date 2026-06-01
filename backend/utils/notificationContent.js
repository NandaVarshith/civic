const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const issueLabel = (issue) => issue?.title || 'your issue';

const buildPlainDetails = (issue, extraLines = []) => {
  const lines = [
    `Issue: ${issueLabel(issue)}`,
    issue?.category ? `Category: ${issue.category}` : null,
    issue?.priority ? `Priority: ${issue.priority}` : null,
    issue?.status ? `Status: ${issue.status}` : null,
    issue?.location?.address ? `Location: ${issue.location.address}` : null,
    ...extraLines,
  ].filter(Boolean);

  return lines.join('\n');
};

const buildEmailHtml = ({ heading, intro, issue, action, extraRows = [] }) => {
  const rows = [
    ['Issue', issueLabel(issue)],
    ['Category', issue?.category],
    ['Priority', issue?.priority],
    ['Status', issue?.status],
    ['Location', issue?.location?.address],
    ...extraRows,
  ].filter(([, value]) => value);

  return `
    <div style="font-family: Arial, sans-serif; color: #1f3556; line-height: 1.5;">
      <h2 style="margin: 0 0 12px; color: #1f3556;">${escapeHtml(heading)}</h2>
      <p style="margin: 0 0 18px;">${escapeHtml(intro)}</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="padding: 10px 12px; border: 1px solid #c9daf5; background: #f3f8ff; font-weight: 700; width: 130px;">${escapeHtml(label)}</td>
            <td style="padding: 10px 12px; border: 1px solid #c9daf5;">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
      ${action ? `<p style="margin: 18px 0 0;">${escapeHtml(action)}</p>` : ''}
      <p style="margin: 22px 0 0; color: #64748b; font-size: 13px;">UrbanPulse notification</p>
    </div>
  `;
};

const buildIssueCreatedContent = (issue) => {
  const title = issueLabel(issue);
  return {
    notification: `Your issue "${title}" was submitted successfully. We have recorded it under ${issue.category} with ${issue.priority} priority.`,
    adminNotification: `New civic issue reported: "${title}" in ${issue.category}. Priority: ${issue.priority}.`,
    subject: `Issue submitted: ${title}`,
    message: `Your issue was submitted successfully.\n\n${buildPlainDetails(issue)}\n\nYou will receive updates here and by email when the issue is assigned or updated.`,
    html: buildEmailHtml({
      heading: 'Issue submitted successfully',
      intro: 'We have received your civic issue and created a tracking record for it.',
      issue,
      action: 'You will receive updates when this issue is assigned or its status changes.',
    }),
  };
};

const buildIssueAssignedContent = (issue, worker, instructions) => {
  const title = issueLabel(issue);
  const instructionLine = instructions ? `Instructions: ${instructions}` : null;

  return {
    workerNotification: `You have been assigned "${title}" (${issue.category}, ${issue.priority} priority). Please review the location and instructions before starting work.`,
    citizenNotification: `Your issue "${title}" has been assigned to ${worker?.username || 'a worker'}. Current status: Assigned.`,
    workerSubject: `New assigned issue: ${title}`,
    citizenSubject: `Your issue has been assigned: ${title}`,
    workerMessage: `A new issue has been assigned to you.\n\n${buildPlainDetails(issue, [instructionLine])}`,
    citizenMessage: `Your issue has been assigned to ${worker?.username || 'a worker'}.\n\n${buildPlainDetails(issue)}\n\nThe worker will update the status as work progresses.`,
    workerHtml: buildEmailHtml({
      heading: 'New issue assigned to you',
      intro: 'An admin has assigned this civic issue to you.',
      issue,
      action: instructions ? `Instructions: ${instructions}` : 'Please review the issue and update the status when work begins.',
    }),
    citizenHtml: buildEmailHtml({
      heading: 'Your issue has been assigned',
      intro: `${worker?.username || 'A worker'} has been assigned to work on your issue.`,
      issue,
      action: 'You will receive another update when the status changes.',
    }),
  };
};

const buildStatusUpdatedContent = (issue, previousStatus, notes) => {
  const title = issueLabel(issue);
  const noteLine = notes ? `Worker note: ${notes}` : null;
  const resolved = issue.status === 'Resolved';

  return {
    type: resolved ? 'Issue Resolved' : 'Issue Status Updated',
    adminNotification: `Worker updated "${title}" from ${previousStatus} to ${issue.status}.`,
    citizenNotification: resolved
      ? `Good news. Your issue "${title}" has been marked Resolved.`
      : `Your issue "${title}" moved from ${previousStatus} to ${issue.status}.`,
    subject: resolved ? `Issue resolved: ${title}` : `Issue status updated: ${title}`,
    message: `${resolved ? 'Your issue has been marked resolved.' : 'Your issue status has been updated.'}\n\n${buildPlainDetails(issue, [
      `Previous status: ${previousStatus}`,
      noteLine,
    ])}`,
    html: buildEmailHtml({
      heading: resolved ? 'Issue marked resolved' : 'Issue status updated',
      intro: resolved
        ? 'The worker has marked your issue as resolved.'
        : `The status changed from ${previousStatus} to ${issue.status}.`,
      issue,
      extraRows: [['Previous status', previousStatus], ['Worker note', notes]],
      action: resolved ? 'Please check your issue details for the latest update.' : 'We will keep you informed as work continues.',
    }),
  };
};

module.exports = {
  buildIssueCreatedContent,
  buildIssueAssignedContent,
  buildStatusUpdatedContent,
};
