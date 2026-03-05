REL=latest
build:
	buildah build \
		--build-arg NEXT_PUBLIC_KEYCLOAK_URL=https://idp.osc.edu/ \
		--build-arg NEXT_PUBLIC_KEYCLOAK_REALM=osc \
		--build-arg NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=kubernetes-skhuvis \
		--build-arg NEXT_PUBLIC_USE_OSC_CHAT_CONFIG=true\
		--ulimit nofile=65536:65536 \
		-t docker-registry.osc.edu/sciapps/hpcgpt_frontend:${REL} \
		.
push:
	docker push docker-registry.osc.edu/sciapps/hpcgpt_frontend:${REL}
