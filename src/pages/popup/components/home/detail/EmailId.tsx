function EmailId({
  emailId,
  isEditing
}: {
  emailId: string | null;
  isEditing: boolean;
}) {
  const containerStyle = `border border-t-0 rounded-b-lg hover:bg-french-blue/[0.4] ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div>
        <div
          className="pt-1 ml-2 text-malibu font-normal text-detailLabel"
          id="emailDescriptionLabel"
        >
          ID
        </div>
        <div className="ml-2 mb-1 font-normal text-white text-detailValue">
          {emailId}
        </div>
      </div>
    </div>
  );
}

export default EmailId;
