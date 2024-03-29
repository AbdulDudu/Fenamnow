import { FaCheck } from "react-icons/fa";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { VscWorkspaceTrusted } from "react-icons/vsc";

export default function Features() {
  return (
    <div className="my-14 w-full lg:h-[60vh]">
      <div className="container flex size-full flex-col items-center justify-center space-y-14">
        <h3>Features</h3>
        <p className="text-lg font-semibold">
          What you get by joining Fenamnow
        </p>
        <div className="grid-col-1 md:grid-col-2 grid size-full lg:grid-cols-3">
          <div className="flex size-full flex-col items-center space-y-10">
            <h4>Connect</h4>
            <div className="relative h-32 w-full">
              <MdOutlineConnectWithoutContact className="size-full" />
            </div>
            <p className="px-6 text-center">
              Our platform provides a seamless and secure online marketplace
              where individuals and businesses can connect, discover, and
              transact with confidence.
            </p>
          </div>
          <div className="flex size-full flex-col items-center space-y-10">
            <h4>Trust and convenience</h4>
            <div className="h-32 w-full">
              <VscWorkspaceTrusted className="size-full" />
            </div>
            <p className="px-6 text-center">
              Our platform is built on a foundation of trust, ensuring that all
              property listings are verified for accuracy and authenticity. We
              prioritize user security by implementing robust data protection
              measures and partnering with trusted payment gateways to
              facilitate safe transactions.
            </p>
          </div>
          <div className="flex size-full flex-col items-center space-y-10">
            <h4>Simplicity</h4>
            <div className="h-32 w-full">
              <FaCheck className="size-full" />
            </div>
            <p className="px-6 text-center">
              With a user-friendly interface, innovative features, and a
              commitment to transparency, Fenamnow aims to transform the
              property market landscape in Sierra Leone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
