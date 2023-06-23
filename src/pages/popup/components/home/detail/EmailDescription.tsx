function EmailDescription({
  emailDescription
}: {
  emailDescription: string | null;
}) {
  const descriptionExists =
    emailDescription !== null && emailDescription !== '';
  const descriptionLabelColor = descriptionExists
    ? 'text-white'
    : 'text-gray-400';
  return (
    <div className="bg-astronaut border border-t-0 border-big-stone hover:bg-french-blue/[0.4]">
      <div>
        <div
          className="pt-1 ml-2 text-malibu font-normal text-detailLabel"
          id="emailDescriptionLabel"
        >
          description
        </div>
        <div
          className={`ml-2 mb-1 font-normal text-detailValue ${descriptionLabelColor}`}
        >
          {descriptionExists ? emailDescription : 'No description set'}
        </div>
      </div>
    </div>
  );
}

export default EmailDescription;
