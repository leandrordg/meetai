interface Props {
  params: Promise<{ meetingId: string }>;
}

export default async function MeetingPage({ params }: Props) {
  const { meetingId } = await params;
  
  return <div>MeetingPage</div>;
}
