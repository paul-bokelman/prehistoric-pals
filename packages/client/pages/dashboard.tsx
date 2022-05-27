import type { NextPage } from "next";
import { useAuthContext } from "context/auth";

type Props = {};

// Your dinos

const Dashboard: NextPage<Props> = (props: Props) => {
  const { user } = useAuthContext();
  return <div>test</div>;
};

export default Dashboard;
